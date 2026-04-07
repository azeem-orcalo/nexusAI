const ALT_CAM_LABEL_PATTERN = /(alt\s*cam|altercam)/i;

const stopStream = (stream: MediaStream | null): void => {
  stream?.getTracks().forEach((track) => track.stop());
};

const listVideoInputs = async (): Promise<MediaDeviceInfo[]> => {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.enumerateDevices !== "function"
  ) {
    return [];
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "videoinput");
};

const findAltCamDevice = (devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined =>
  devices.find((device) => ALT_CAM_LABEL_PATTERN.test(device.label));

export const getAltCamStream = async ({
  audio = true,
  requireAltCam = false
}: {
  audio?: boolean;
  requireAltCam?: boolean;
} = {}): Promise<MediaStream> => {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== "function"
  ) {
    throw new Error("Camera APIs unavailable");
  }

  let devices = await listVideoInputs();
  let altCamDevice = findAltCamDevice(devices);

  if (!altCamDevice) {
    const probeStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    try {
      devices = await listVideoInputs();
      altCamDevice = findAltCamDevice(devices);

      if (!altCamDevice && !audio) {
        return probeStream;
      }
    } finally {
      stopStream(probeStream);
    }
  }

  if (altCamDevice) {
    return navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: altCamDevice.deviceId }
      },
      audio
    });
  }

  if (requireAltCam) {
    throw new Error("AltCam device not found");
  }

  return navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio
  });
};

export const hasAltCamLabel = (label: string): boolean =>
  ALT_CAM_LABEL_PATTERN.test(label);
