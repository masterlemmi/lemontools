package com.lemoncode.resource;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CacheService {

    private final Map<String, CacheQueue<String>> cachePerUser = new ConcurrentHashMap<>();


    public CacheQueue<String> getCache(String username) {
        CacheQueue<String> cache = cachePerUser.get(username);

        if (cache == null) {
            cachePerUser.put(username, new CacheQueue<>(20));
        }
        return cachePerUser.get(username);

    }

    public void saveToCache(String username, String profileJson) {
        CacheQueue<String> cacheQueue = cachePerUser.get(username);

        if (cacheQueue == null) {
            CacheQueue<String> cache = new CacheQueue<>(20);
            cache.add(profileJson);
            cachePerUser.put(username, cache);
        } else {
            cachePerUser.get(username).add(profileJson);
        }
    }


    static class CacheQueue<T> extends AbstractCollection<T> {

        private final int size;

        private ArrayDeque<T> deque;

        public CacheQueue(int size) {
            super();
            this.size = size;
            deque = new ArrayDeque<>(size);
        }

        @Override
        public Iterator<T> iterator() {
            return deque.iterator();
        }

        @Override
        public int size() {
            return deque.size();
        }

        @Override
        public boolean add(T e) {
            if (deque.contains(e))
                return false;

            if (deque.size() == size) {
                deque.pollFirst();
            }
            return deque.add(e);
        }

        @Override
        public boolean remove(Object o) {
            return deque.remove(o);
        }

        public Set<T> asSet() {
            return new HashSet<>(deque);
        }
    }
}
