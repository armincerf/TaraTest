import React from "react";
import type { RefCallback } from "react";

type CaretProps = {
	offset: number;
};

const Caret = ({ offset }: CaretProps) => {
	return (
		<div
			className="absolute w-0.5 h-5 rounded-sm bg-gray-800 transition-left duration-200 animate-blink"
			style={{ left: offset }}
		/>
	);
};

type LetterProps = {
	char: string;
	status: string;
};

const Letter = React.memo(({ char, status }: LetterProps) => {
	return (
		<div
			className={`
        text-sm pl-0.5
        ${status === "waiting" ? "text-gray-400" : ""}
        ${status === "active" ? "text-blue-500" : ""}
        ${status === "correct" ? "text-green-500" : ""}
        ${status === "incorrect" ? "text-red-500" : ""}
      `}
		>
			{char}
		</div>
	);
});

type WordProps = {
	word: string;
	typedWord: string;
	wordRef: RefCallback<HTMLDivElement>;
	status: string;
};

const Word = React.memo(
	({ word, typedWord = "", wordRef, status }: WordProps) => {
		const componentList = word.split("").map((char, i) => {
			let letterStatus = "waiting";

			if (status === "active") {
				letterStatus = "active";
			}
			if (typedWord.charAt(i) === char) letterStatus = "correct";
			else if (typedWord.charAt(i) !== "") letterStatus = "incorrect";

			return <Letter char={char} status={letterStatus} key={i} />;
		});

		const suffix =
			typedWord.length > word.length ? typedWord.slice(word.length) : "";

		return (
			<div
				className={`flex my-1.5 mx-1 border-b-2 border-transparent ${
					status === "active" ? "relative" : ""
				} ${status === "done" ? "opacity-50" : ""} ${
					status === "incorrect" ? "opacity-50 border-red-500" : ""
				}`}
				ref={status === "active" ? wordRef : null}
			>
				{status === "active" && (
					<Caret offset={16.52 * typedWord?.length || 0} />
				)}
				{componentList}
				{suffix.split("").map((char, i) => (
					<Letter char={char} status="incorrect" key={`s${i}`} />
				))}
			</div>
		);
	},
);

export default Word;
