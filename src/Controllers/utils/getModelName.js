export const getModelName = (modalInstance) => {
  if (!modalInstance) return "";

  if (modalInstance.modelName) return modalInstance.modelName.toLowerCase();

  if (modalInstance.constructor?.modelName)
    return modalInstance.constructor.modelName.toLowerCase();

  if (modalInstance.constructor?.name)
    return modalInstance.constructor.name.toLowerCase();

  return "";
};
