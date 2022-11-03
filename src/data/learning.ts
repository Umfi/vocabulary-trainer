import dayjs from "dayjs";
import { supermemo } from "supermemo";
import { getBoxes } from "./box";
import { editVocable, getVocable, Vocable } from "./vocable";

/**
 * Answer a vocable and update it's supermemo values
 * @param voc 
 * @param answer 
 */
export async function giveAnswer(voc: Vocable, answer: boolean) {
    
    const vocable = await getVocable(voc.boxId, voc.id);

    const { interval, repetition, efactor } = supermemo(vocable, answer ? 5 : 0);

    const dueDate = dayjs(Date.now()).add(interval, 'day').toISOString();

    vocable.interval = interval;
    vocable.repetition = repetition;
    vocable.efactor = efactor;
    vocable.dueDate = dueDate;

    await editVocable(vocable.boxId, vocable);
}

/**
 * Get list of words to learn
 * @returns Vocable[]
 */
export async function getDueVocables() {
    const boxes = await getBoxes();
    const words = [] as Vocable[];

    for (let i = 0; i < boxes.length; i++) {
        const items = boxes[i].vocables;
        for (let j = 0; j < items.length; j++) {
            words.push(items[j]);
        }
    }

    return words.filter(vocable => dayjs(vocable.dueDate).isBefore(dayjs(Date.now())));
}
