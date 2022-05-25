export class Collection<K, V> extends Map<K, V> {
  first(amount?: number): V | V[] | undefined {
    if (typeof amount === "undefined") return this.values().next().value;
    if (amount < 0) return this.last(amount * -1);
    const amountToGet = Math.min(this.size, amount);
    const iter = this.values();
    return Array.from({ length: amountToGet }, (): V => iter.next().value);
  }

  last(amount?: number): V | V[] | undefined {
    const arr = [...this.values()];
    if (typeof amount === "undefined") return arr[arr.length - 1];
    if (amount < 0) return this.first(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }
}
