const capitalize = (text: string = '') => {
  if (text?.length > 0) {
    text = text.replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase());
  } else {
    text = 'N/A';
  }
  return text;
};

export default capitalize;
