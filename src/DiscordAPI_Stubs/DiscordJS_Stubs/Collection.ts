/* eslint-disable import/prefer-default-export */
export class Collection<K, V> extends Map<K, V> {
  first(amount?: number): V | V[] | undefined {
    if (typeof amount === 'undefined') return this.values().next().value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.values();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return Array.from({ length: amount }, (): V => iter.next().value);
  }

  last(amount?: number): V | V[] | undefined {
		const arr = [...this.values()];
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}
}
