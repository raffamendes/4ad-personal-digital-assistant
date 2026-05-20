package com.rmendes.resource;

import com.rmendes.entity.User;
import com.rmendes.service.UserService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Optional;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserService userService;

    @POST
    @Path("/login")
    public Response login(User user) {
        Optional<User> foundUser = userService.findByUsername(user.username);
        if (foundUser.isPresent() && foundUser.get().password.equals(user.password)) {
            return Response.ok(foundUser.get()).build();
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @POST
    @Path("/register")
    public Response register(User user) {
        if (userService.exists(user.username)) {
            return Response.status(Response.Status.CONFLICT).entity("User already exists").build();
        }
        userService.persist(user);
        return Response.status(Response.Status.CREATED).entity(user).build();
    }
}
