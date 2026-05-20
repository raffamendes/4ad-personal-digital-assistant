package com.rmendes.resource;

import com.rmendes.entity.Character;
import com.rmendes.service.CharacterService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;

@Path("/characters")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CharacterResource {

    private static final Logger LOG = Logger.getLogger(CharacterResource.class);

    @Inject
    CharacterService characterService;

    @GET
    public List<Character> getAllCharacters() {
        LOG.info("Fetching all characters from Redis");
        return characterService.listAll();
    }

    @GET
    @Path("/{id}")
    public Character getCharacterById(@PathParam("id") Long id) {
        LOG.infof("Fetching character with id: %d", id);
        Character entity = characterService.findById(id);
        if (entity == null) {
            LOG.warnf("Character with id %d not found", id);
            throw new NotFoundException();
        }
        return entity;
    }

    @POST
    public Response createCharacter(Character character) {
        LOG.infof("Creating character: %s", character.name);
        characterService.persist(character);
        return Response.ok(character).status(201).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateCharacter(@PathParam("id") Long id, Character character) {
        LOG.infof("Updating character with id: %d", id);
        Character entity = characterService.findById(id);
        if (entity == null) {
            LOG.warnf("Character with id %d not found", id);
            throw new NotFoundException();
        }
        character.id = id;
        characterService.persist(character);
        return Response.ok(character).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteCharacter(@PathParam("id") Long id) {
        LOG.infof("Deleting character with id: %d", id);
        characterService.delete(id);
        return Response.status(204).build();
    }
}
