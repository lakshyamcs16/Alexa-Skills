/*

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.Implement the LRUCache class:Follow up:
Could you do get and put in O(1) time complexity? Example 1: Constraints:


*/

/*

Input
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4



*/

class LRUCache {
​
    Set<Integer> q;
    Map<Integer, Integer> map;
    int capacity;
    
    public LRUCache(int capacity) {
        q = new LinkedHashSet<Integer>(); 
        map = new HashMap<Integer, Integer>();
        this.capacity = capacity;
    }
    
    public int get(int key) {        
        if(map.containsKey(key)) {
            
            if(q.size() > 0 && q.contains(key)) {
                q.remove(key);
                q.add(key);
            }
            return map.get(key);
        }
        
        return -1;
    }
    
    public void put(int key, int value) {
        if(map.size() >= capacity && !map.containsKey(key)) {
            int lru = q.stream().findFirst().get();
            q.remove(lru);
            map.remove(lru);
        }
        
        map.put(key, value);
​
        if(q.size() > 0 && q.contains(key)) {
            q.remove(key);
        }
​
        q.add(key);
    }
}
​
/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
​
