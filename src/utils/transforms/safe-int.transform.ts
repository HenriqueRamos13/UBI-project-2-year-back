export const SafeIntTransform = ({ value }) => {
  try {
    const val = parseInt(value, 10);
    return val;
  } catch (error) {
    return value;
  }
};
