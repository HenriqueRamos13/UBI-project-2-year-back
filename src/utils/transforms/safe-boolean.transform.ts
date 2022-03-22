export const SafeBooleanTransform = ({ value }) => {
  try {
    if (typeof value === 'string') {
      return value === 'true';
    } else {
      return value;
    }
  } catch (error) {
    return value;
  }
};
