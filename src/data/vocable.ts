import { getStorage } from "@/main";
import { getBoxes } from "./box";
import { uuid } from 'vue-uuid';
import { SuperMemoItem } from "supermemo";
import dayjs from "dayjs";

export interface Vocable extends SuperMemoItem {
    id: string;
    boxId: string;
    native: string;
    foreign: string;
    dueDate: string;
}

/**
 * Get a vocable
 * @param boxId
 * @param vocableId
 */
 export async function getVocable(boxId: string, vocableId: string) {
    const boxes = await getBoxes();
    const index = boxes.findIndex((obj => obj.id == boxId));
    if (index == -1) {
        throw new Error('Box not found');
    }

    const indexVariables = boxes[index].vocables.findIndex((obj => obj.id == vocableId));
    if (indexVariables == -1) {
        throw new Error('Vocable not found');
    }

    return boxes[index].vocables[indexVariables];
}

/**
 * Add vocable
 * @param boxId
 * @param foreign
 * @param native
 * @returns Vocable
 */
export async function createVocable(boxId: string, foreign: string, native: string) {
    const boxes = await getBoxes();
    const index = boxes.findIndex((obj => obj.id == boxId));
    if (index == -1) {
        throw new Error('Box not found');
    }

    const id = uuid.v4();

    const vocable: Vocable = {
        id,
        boxId,
        native,
        foreign,
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        dueDate: dayjs(Date.now()).toISOString()
    };

    boxes[index].vocables.push(vocable);
    await getStorage().set('boxes', boxes);
    return vocable;
}

/**
 * Delete a vocable
 * @param boxId
 * @param vocableId
 */
export async function deleteVocable(boxId: string, vocableId: string) {
    const boxes = await getBoxes();
    const index = boxes.findIndex((obj => obj.id == boxId));
    if (index == -1) {
        throw new Error('Box not found');
    }

    const indexVariables = boxes[index].vocables.findIndex((obj => obj.id == vocableId));
    if (indexVariables == -1) {
        throw new Error('Vocable not found');
    }

    boxes[index].vocables.splice(indexVariables, 1);

    await getStorage().set('boxes', boxes);
}

/**
 * Edit a vocable
 * @param boxId
 * @param vocable
 */
export async function editVocable(boxId: string, vocable: Vocable) {
    const boxes = await getBoxes();
    const index = boxes.findIndex((obj => obj.id == boxId));
    if (index == -1) {
        throw new Error('Box not found');
    }

    const indexVariables = boxes[index].vocables.findIndex((obj => obj.id == vocable.id));
    if (indexVariables == -1) {
        throw new Error('Vocable not found');
    }

    boxes[index].vocables[indexVariables] = vocable;

    await getStorage().set('boxes', boxes);
}