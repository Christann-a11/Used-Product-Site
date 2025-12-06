export const getModelName = (modal) => {
  if (!modal) {
    return '';
  }

  const rawName =
    modal.modelName ||
    modal.constructor?.modelName ||
    modal.name ||
    modal.constructor?.name ||
    '';

  return rawName.toLowerCase();
};
