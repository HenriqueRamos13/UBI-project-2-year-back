export const SafeNumberTransform = ({ value }) => {
  try {
    return Number(value);
  } catch (error) {
    return value;
  }
};
