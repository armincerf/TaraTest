import { useEffect, useRef, useState } from "react";

type Callback = () => void;

const useTimer = (
	timeoutCallback: Callback,
	intervalCallback?: Callback,
): [number, (time: number) => void] => {
	const [time, setTime] = useState(0);
	const [timeCount, setTimeCount] = useState(-1);
	const intervalFunc = useRef(() => {
		return;
	});

	const setTimer = (time: number) => {
		setTime(time * 10); // For avoiding floating point shenanigans
		setTimeCount(0);
	};

	useEffect(() => {
		intervalFunc.current = () => {
			setTimeCount(timeCount + 1);
			if (intervalCallback) intervalCallback();
		};
		if (timeCount === time && time !== 0) {
			setTime(0);
			if (timeoutCallback) timeoutCallback();
		}
	}, [timeCount, intervalCallback, timeoutCallback, time]);

	useEffect(() => {
		if (time === 0) return;
		const intervalId = window.setInterval(() => {
			intervalFunc.current();
		}, 100);

		return () => {
			clearInterval(intervalId);
		};
	}, [time]);

	return [timeCount / 10, setTimer]; // Also for avoiding floating point shenanigans
};

export default useTimer;
