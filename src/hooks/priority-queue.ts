/**
 * Priority Queue is a data structure that is similar to a queue, except that items in the queue are kept in order.
 * The order is determined by the priority of the item.
 * The priority of an item is determined by the order in which it is inserted.
 * The highest priority item is inserted first, and the next highest priority item is inserted after that, and so on.
 * The priority queue is implemented using a binary heap.
 */
 class PriorityQueue<Q>{

    private size: number;
    private queue: Q[];
    private prirotiesMap: { [key: number]: Q[] };
    private priorities: number[];
    /**
     * Priority Queue 
     * @param size
     */
    public constructor(size: number) {
        this.size = size;
        this.queue = [];
        this.prirotiesMap = {};
        this.priorities = [];
    }
    /**
     * Inserts an item into the priority queue.
     * @param item
     * @param priority
     * @memberof PriorityQueue
     * @throws {Error}
     */
    public insert(item: Q, priority: number) {
        if (this.isFull()) {
            throw new Error("Queue is full");
        }
        if (!Number.isInteger(priority)) {
            throw new Error("Priority must be number");
        }
        this.priorities = [];
        if (!this.prirotiesMap[priority]) {
            this.prirotiesMap[priority] = [];
        }
        this.prirotiesMap[priority].push(item);
        let queues: Q[] = [];
        for (let [key, value] of Object.entries(this.prirotiesMap)) {
            //@ts-ignore
            this.priorities.unshift(key);
            queues = [...value, ...queues];
        }
        this.queue = queues;
    }
    /**
     * Removes and returns the highest priority item in the queue.
     * @returns {Q}
     * @memberof PriorityQueue
     * @throws {Error}
     */
    public remove():Q {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        let item = this.queue.splice(0, 1);
        for (let index = 0; index < this.priorities.length; index++) {
            const key = this.priorities[index];
            const element = this.prirotiesMap[key];
            if (element?.length) {
                element.splice(0, 1);
                //@ts-ignore
                this.priorities[key] = element;
                break;
            }
        }
        return item[0];
    }
    /**
     * Returns the highest priority item in the queue without removing it.
     * @returns {Q}
     * @memberof PriorityQueue
     * @throws {Error}
     */
    public peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.queue[0];
    }
    /**
     * Returns true if the queue is empty.
     * @returns {boolean}
     * @memberof PriorityQueue
     */
    public isEmpty(): boolean {
        return this.queue.length === 0;
    }
    /**
     * Returns true if the queue is full.
     * @returns {boolean}
     * @memberof PriorityQueue
     */
    public isFull(): boolean {
        return this.queue.length === this.size;
    }

}

export default PriorityQueue;