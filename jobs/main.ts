import { fetchGoodsSteamPrice } from "./fetch_goods_steam_price";
import { generateGoodsData } from "./generate_goods_data";
import { fetchGoodsNameId } from "./fetch_goods_nameid";
import { taskFlush } from "./task_flush";
import { scheduleJob } from "node-schedule";
import { EventEmitter } from "events";
import { jobConfig } from "../config";

const jobWrapper = (ev: EventEmitter, jobFunc: (args?) => any, displayName: string) => async (args) => {
    try {
        await jobFunc(args);
        ev.emit(`${displayName}-success`);
    } catch (e) {
        ev.emit(`${displayName}-error`, `Job function run error! Name is ${displayName}，Err info:\n${e}`);
    }
};

(async () => {

    const ev = new EventEmitter();

    const fetchGoodsSteamPriceJob = scheduleJob(jobConfig.CRONRULE.fetchGoodsSteamPriceJob, jobWrapper(ev, fetchGoodsSteamPrice, "fetchGoodsSteamPrice"));

    const generateGoodsDataJob = scheduleJob(jobConfig.CRONRULE.generateGoodsDataJob, jobWrapper(ev, generateGoodsData, "generateGoodsData"));

    const fetchGoodsNameIdJob = scheduleJob(jobConfig.CRONRULE.fetchGoodsNameIdJob, jobWrapper(ev, fetchGoodsNameId, "fetchGoodsNameId"));

    const taskFlushJob = scheduleJob(jobConfig.CRONRULE.taskFlushJob, jobWrapper(ev, taskFlush, "taskFlush"));

    ev.on("fetchGoodsSteamPrice-error", (e) => {
        console.error(e);
    });

    ev.on("generateGoodsData-error", (e) => {
        console.error(e);
    });

    ev.on("fetchGoodsNameId-error", (e) => {
        console.error(e);
    });

    ev.on("taskFlush-error", (e) => {
        console.log(e);
    });

    ev.on("fetchGoodsSteamPrice-success", (e) => {
        console.log(`fetchGoodsSteamPrice next time is ${fetchGoodsSteamPriceJob.nextInvocation().toLocaleString()}`);
    });

    ev.on("generateGoodsData-success", (e) => {
        console.log(`generateGoodsData next time is ${generateGoodsDataJob.nextInvocation().toLocaleString()}`);
    });

    ev.on("fetchGoodsNameId-success", (e) => {
        console.log(`fetchGoodsNameId next time is ${fetchGoodsNameIdJob.nextInvocation().toLocaleString()}`);
    });

    ev.on("taskFlush-success", (e) => {
        console.log(`taskFlush next time is ${taskFlushJob.nextInvocation().toLocaleString()}`);
    });

})();
