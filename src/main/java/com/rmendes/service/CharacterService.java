package com.rmendes.service;

import com.rmendes.entity.Character;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.hash.HashCommands;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class CharacterService {

    private final HashCommands<String, String, Character> hashCommands;
    private final ValueCommands<String, Long> idCommands;
    private static final String CACHE_KEY = "characters";
    private static final String ID_KEY = "character:id:seq";

    public CharacterService(RedisDataSource ds) {
        this.hashCommands = ds.hash(Character.class);
        this.idCommands = ds.value(Long.class);
    }

    public List<Character> listAll() {
        return new ArrayList<>(hashCommands.hvals(CACHE_KEY));
    }

    public Character findById(Long id) {
        return hashCommands.hget(CACHE_KEY, id.toString());
    }

    public void persist(Character character) {
        if (character.id == null) {
            character.id = idCommands.incr(ID_KEY);
        }
        hashCommands.hset(CACHE_KEY, character.id.toString(), character);
    }

    public void delete(Long id) {
        hashCommands.hdel(CACHE_KEY, id.toString());
    }
}
