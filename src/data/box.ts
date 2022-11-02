import { getStorage } from '@/main'
import { Vocable } from "./vocable";
import { uuid } from 'vue-uuid';

export interface Box {
    id: string;
    name: string;
    vocables: Vocable[];
}

/**
 * Get all boxes
 * @returns Box[]
 */
 export async function getBoxes() {
    const boxes = await getStorage().get('boxes') as Box[];

    if (boxes == null) {
        return [];
    }

    return boxes;
}

/**
 * Get box by id
 * @param id 
 * @returns Box
 */
 export async function getBox(id: string) {
    const boxes = await getBoxes();
    return boxes.find(m => m.id === id);
  }

/**
 * Add box
 * @param name
 * @returns Box
 */
export async function createBox(name: string) {
    const boxes = await getBoxes();
    const id = uuid.v4();
    const box: Box = {
        id,
        name,
        vocables: []
    };
    boxes.push(box);
    await getStorage().set('boxes', boxes);
    return box;
}

/**
 * Delete a box
 * @param boxId
 * @throws Error
 */
 export async function deleteBox(boxId: string) {
    const boxes = await getBoxes();
    const index = boxes.findIndex((obj => obj.id == boxId));
    if (index == -1) {
        throw new Error('Box not found');
    }

    boxes.splice(index, 1);

    await getStorage().set('boxes', boxes);
}

/**
 * Edit a box
 * @param boxId
 */
 export async function editBox(boxId: string, box: Box) {
    const boxes = await getBoxes();
    const index = boxes.findIndex((obj => obj.id == boxId));
    if (index == -1) {
        throw new Error('Box not found');
    }

    boxes[index].name = box.name;

    await getStorage().set('boxes', boxes);
}