package com.rmendes.resource;

import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.hash.HashCommands;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.Map;
import org.jboss.logging.Logger;

@Path("/migration")
public class MigrationResource {

    private static final Logger LOG = Logger.getLogger(MigrationResource.class);
    private final HashCommands<String, String, String> hashCommands;

    public MigrationResource(RedisDataSource ds) {
        this.hashCommands = ds.hash(String.class);
    }

    @GET
    @Path("/fix-spells")
    @Produces(MediaType.TEXT_PLAIN)
    public String fixSpells() {
        Map<String, String> characters = hashCommands.hgetall("characters");
        LOG.info("Found " + characters.size() + " characters in Redis");
        int fixedCount = 0;

        for (Map.Entry<String, String> entry : characters.entrySet()) {
            String id = entry.getKey();
            String json = entry.getValue();
            LOG.info("Checking character " + id + ": " + json);

            // If "spells" is followed by a string (starts with ") instead of an array (starts with [)
            // JSON pattern: "spells":"..." or "spells": "..."
            // We want to replace whatever is between the value quotes with []
            
            if (json.contains("\"spells\"")) {
                int spellsKeyIndex = json.indexOf("\"spells\"");
                int colonIndex = json.indexOf(":", spellsKeyIndex);
                int firstQuoteAfterColon = json.indexOf("\"", colonIndex);
                int firstBracketAfterColon = json.indexOf("[", colonIndex);
                
                // If there's a quote before a bracket, it's a string
                if (firstQuoteAfterColon != -1 && (firstBracketAfterColon == -1 || firstQuoteAfterColon < firstBracketAfterColon)) {
                    int secondQuote = json.indexOf("\"", firstQuoteAfterColon + 1);
                    if (secondQuote != -1) {
                        String fixedJson = json.substring(0, firstQuoteAfterColon) + "[]" + json.substring(secondQuote + 1);
                        LOG.info("Fixing character " + id + ". New JSON: " + fixedJson);
                        hashCommands.hset("characters", id, fixedJson);
                        fixedCount++;
                    }
                }
            } else {
                // If it doesn't have spells at all, Jackson might still complain if the class requires it
                // but usually it just stays null. However, let's add it if missing just in case.
                String fixedJson = json.substring(0, json.length() - 1) + ",\"spells\":[]}";
                hashCommands.hset("characters", id, fixedJson);
                fixedCount++;
            }
        }

        return "Migration complete. Processed " + characters.size() + " characters. Fixed " + fixedCount + " characters.";
    }
}
