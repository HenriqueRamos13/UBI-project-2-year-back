export const SafeDateTransform = ({ value }) => {
  try {
    return new Date(value).toISOString();
  } catch (error) {
    return value;
  }
};
