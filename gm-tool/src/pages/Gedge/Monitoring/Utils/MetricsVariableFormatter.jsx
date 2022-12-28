const unixCurrentTime = () => Math.ceil(new Date().getTime() / 1000);

const unixStartTime = (interval) =>
    // interval : (10m) -> 10 * 60s, (1h) -> 60 * 60s
    // realtime => 5s
    Math.ceil(unixCurrentTime() - interval * 60);

const unixToTime = (unixTimestamp) => {
    const timestamp = new Date(unixTimestamp * 1000);
    return (
        ("0" + timestamp.getHours()).substring(
            ("0" + timestamp.getHours()).length - 2,
            ("0" + timestamp.getHours()).length
        ) +
        ":" +
        ("0" + timestamp.getMinutes()).substring(
            ("0" + timestamp.getMinutes()).length - 2,
            ("0" + timestamp.getMinutes()).length
        ) +
        ":" +
        ("0" + timestamp.getSeconds()).substring(
            ("0" + timestamp.getSeconds()).length - 2,
            ("0" + timestamp.getSeconds()).length
        )
    );
};
const unixToTime2 = (unixTimestamp) => {
    const timestamp = new Date(unixTimestamp * 1000);
    const date = new Date(unixTimestamp)

    return date.toTimeString().split(" ")[0]
};

const stepConverter = (time) => {
    if (time < 1) {
        return time * 60 + "s";
    } else if (time < 60) {
        return time + "m";
    } else {
        return time / 60 + "h";
    }
};

const combinationMetrics = (...metrics) => {
    let result = "";

    for (let index = 0; index < metrics.length; index++) {
        if (index === metrics.length - 1) {
            result += metrics[index];
        } else {
            result += metrics[index] + "|";
        }
    }

    return result;
};

const LastTimeList = [
    { name: "10M", value: 10 },
    { name: "20M", value: 20 },
    { name: "30M", value: 30 },
    { name: "1H", value: 60 },
    { name: "2H", value: 120 },
    { name: "3H", value: 180 },
    { name: "5H", value: 300 },
    { name: "12H", value: 720 },
];

const IntervalList = [
    { name: "1M", value: 1 },
    { name: "2M", value: 2 },
    { name: "5M", value: 5 },
    { name: "10M", value: 10 },
    { name: "15M", value: 15 },
    { name: "30M", value: 30 },
    { name: "1H", value: 60 },
];

export {
    stepConverter,
    unixCurrentTime,
    unixStartTime,
    combinationMetrics,
    unixToTime,
    LastTimeList,
    IntervalList,
};
