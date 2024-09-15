import React from "react";
import type { RefCallback } from "react";
import Word from "./Word";

type Props = {
	wordList: string[];
	typedWordList: string[];
	activeWordIndex: number;
	wordRef: RefCallback<HTMLDivElement>;
};

const WordSet = ({
	wordList,
	typedWordList,
	activeWordIndex,
	wordRef,
}: Props) => {
	const componentList = wordList.map((word, i) => {
		let wordStatus = "passive";

		if (activeWordIndex === i) {
			wordStatus = "active";
		} else if (activeWordIndex > i) {
			if (typedWordList[i] !== word) wordStatus = "incorrect";
			else wordStatus = "done";
		}
		return (
			<Word
				word={word}
				typedWord={typedWordList[i]}
				wordRef={wordRef}
				status={wordStatus}
				key={word + i}
			/>
		);
	});

	return (
		<div className="flex flex-wrap overflow-hidden max-h-[5.2rem] mx-auto px-4">
			{componentList}
		</div>
	);
};

export default WordSet;
