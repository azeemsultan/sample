const getNthCharacterPosition = (str: string, subString: string, index: number): number => str?.split(subString, index)?.join(subString).length;

export default getNthCharacterPosition;
