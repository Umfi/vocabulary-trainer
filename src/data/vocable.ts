import { getStorage } from "@/main";
import { getBoxes } from "./box";
import { uuid } from 'vue-uuid';

export interface Vocable {
    id: string;
    native: string;
    foreign: string;
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
        native,
        foreign
    };

    boxes[index].vocables.push(vocable);
    await getStorage().set('boxes', boxes);
    return vocable;
}

/**
 * Delete a vocabel
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