package com.lemoncode.resource;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CacheService {

    private ObjectMapper mapper = new ObjectMapper();

    private final Map<String, CacheQueue> cachePerUser = new ConcurrentHashMap<>();


    public CacheQueue getCache(String username) {
        CacheQueue cache = cachePerUser.get(username);

        if (cache == null) {
            cachePerUser.put(username, new CacheQueue(20));
        }

        return cachePerUser.get(username);

    }

    public void saveToCache(String username, String profileJson) throws JsonProcessingException {
        CacheQueue cacheQueue = cachePerUser.get(username);
        JsonNode actualObj = mapper.readTree(profileJson);

        if (cacheQueue == null) {
            CacheQueue cache = new CacheQueue(20);
            cache.add(actualObj);
            cachePerUser.put(username, cache);
        } else {
            cachePerUser.get(username).add(actualObj);
        }
    }


    static class CacheQueue extends AbstractCollection<JsonNode> {

        private final int size;

        private ArrayDeque<JsonNode> deque;

        public CacheQueue(int size) {
            super();
            this.size = size;
            deque = new ArrayDeque<>(size);
        }

        @Override
        public Iterator<JsonNode> iterator() {
            return deque.iterator();
        }

        @Override
        public int size() {
            return deque.size();
        }

        @Override
        public boolean add(JsonNode e) {

            if (deque.size() == size) {
                deque.pollFirst();
            }

            removeIfExists(e);

            return deque.add(e);
        }

        boolean removeIfExists(JsonNode s) {
            long id = s.get("id").asLong();

            for (JsonNode node : deque) {
                long xId = node.get("id").asLong();
                if (id == xId)
                    return deque.remove(node);
            }
            return false;
        }

        @Override
        public boolean remove(Object o) {
            return deque.remove(o);
        }

        public Set<JsonNode> asSet() {
            return new HashSet<>(deque);
        }
    }
}
