package com.rmendes.service;

import com.rmendes.entity.User;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.hash.HashCommands;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class UserService {

    private final HashCommands<String, String, User> hashCommands;
    private final ValueCommands<String, Long> idCommands;
    private static final String CACHE_KEY = "users";
    private static final String ID_KEY = "user:id:seq";

    public UserService(RedisDataSource ds) {
        this.hashCommands = ds.hash(User.class);
        this.idCommands = ds.value(Long.class);
    }

    public void persist(User user) {
        if (user.id == null) {
            user.id = idCommands.incr(ID_KEY);
        }
        hashCommands.hset(CACHE_KEY, user.username, user);
    }

    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(hashCommands.hget(CACHE_KEY, username));
    }

    public boolean exists(String username) {
        return hashCommands.hexists(CACHE_KEY, username);
    }
}
