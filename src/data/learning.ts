import { getStorage } from "@/main";
import { getBox, getBoxes } from "./box";
import { Vocable } from "./vocable";
import { uuid } from 'vue-uuid';

export interface Learning {
    id: string;
    boxId: string;
    stacks: LearningStack[];
}

export interface LearningStack {
    id: string;
    vocables: Vocable[];
}

export async function getLearningOfBox(boxId: string) {
    let learning = await getStorage().get('learning-' + boxId) as Learning;

    if (learning == null) {
        const box = await getBox(boxId);
        if (box == null) {
            throw new Error('Box not found');
        }

        learning = {
            id: uuid.v4(),
            boxId: boxId,
            stacks: [
                {
                    id: uuid.v4(),
                    vocables: []
                } as LearningStack,
                {
                    id: uuid.v4(),
                    vocables: []
                } as LearningStack,
                {
                    id: uuid.v4(),
                    vocables: []
                } as LearningStack,
                {
                    id: uuid.v4(),
                    vocables: []
                } as LearningStack,
                {
                    id: uuid.v4(),
                    vocables: []
                } as LearningStack
            ] as LearningStack[]
        } as Learning;

        learning.stacks[0].vocables = box.vocables;

        getStorage().set('learning-' + boxId, learning);
    }

    return learning;
}

export async function getLearningProgress(boxId: string) {
    if (boxId != undefined) {
        const box = await getBox(boxId);
        if (box) {
            const total = box.vocables.length;
            const learning = await getLearningOfBox(boxId);
            
            return [ 
                (100 * learning.stacks[0].vocables.length) / total,  
                (100 * learning.stacks[1].vocables.length) / total,  
                (100 * learning.stacks[2].vocables.length) / total,  
                (100 * learning.stacks[3].vocables.length) / total,  
                (100 * learning.stacks[4].vocables.length) / total 
            ];   
        }
    }

    return [ 0, 0, 0, 0, 0 ];
}

export async function getNextWord(boxId: string) : Promise<Vocable>{
    
    if (boxId == undefined) {
        const words= [];
        const boxes = await getBoxes();
        for (let i = 0; i < boxes.length; i++) {
          const items = boxes[i].vocables;
          for (let j = 0; j < items.length; j++) {
            words.push(items[j]);
          }
        }
        
        const rand = Math.floor(Math.random() * words.length);
        return words[rand];

    } else {
        const learning = await getLearningOfBox(boxId);
        
        if (learning.stacks[0].vocables.length > 0) {
            const rand = Math.floor(Math.random() * learning.stacks[0].vocables.length);
            return learning.stacks[0].vocables[rand];
        } else if (learning.stacks[1].vocables.length > 0) {
            const rand = Math.floor(Math.random() * learning.stacks[1].vocables.length);
            return learning.stacks[1].vocables[rand];
        } else if (learning.stacks[2].vocables.length > 0) {
            const rand = Math.floor(Math.random() * learning.stacks[2].vocables.length);
            return learning.stacks[2].vocables[rand];
        } else if (learning.stacks[3].vocables.length > 0) {
            const rand = Math.floor(Math.random() * learning.stacks[3].vocables.length);
            return learning.stacks[3].vocables[rand];
        } else {
            const rand = Math.floor(Math.random() * learning.stacks[4].vocables.length);
            return learning.stacks[4].vocables[rand];
        }
    }
}

export async function answerWord(boxId: string, vocableId: string, correct: boolean) {
    if (boxId != undefined) {
        const learning = await getLearningOfBox(boxId);

        for (let i = 0; i < learning.stacks.length; i++) {
            const index = learning.stacks[i].vocables.findIndex((obj => obj.id == vocableId));
            if (index > -1) {
                if (correct) {
                    if (i < learning.stacks.length - 1) {
                        learning.stacks[i + 1].vocables.push(learning.stacks[i].vocables[index]);
                        learning.stacks[i].vocables.splice(index, 1);
                    } else {
                        learning.stacks[learning.stacks.length - 1].vocables.push(learning.stacks[i].vocables[index]);
                        learning.stacks[i].vocables.splice(index, 1);
                    }
                } else {
                    learning.stacks[0].vocables.push(learning.stacks[i].vocables[index]);
                    learning.stacks[i].vocables.splice(index, 1);
                }
    
                getStorage().set('learning-' + boxId, learning);
                break;
            }
        }
    }
}
