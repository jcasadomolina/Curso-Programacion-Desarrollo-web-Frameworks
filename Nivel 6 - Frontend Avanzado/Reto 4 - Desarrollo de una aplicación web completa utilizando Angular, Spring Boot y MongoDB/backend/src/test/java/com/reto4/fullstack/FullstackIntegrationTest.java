package com.reto4.fullstack;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class FullstackIntegrationTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void registerLoginCreateReadAndDeleteEvent() throws Exception {
        String email = "integration-" + UUID.randomUUID() + "@example.com";
        String registerBody = "{\"name\":\"Integration User\",\"email\":\"" + email + "\",\"password\":\"password123\"}";
        MvcResult register = mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(registerBody)).andExpect(status().isCreated()).andReturn();
        String token = objectMapper.readTree(register.getResponse().getContentAsString()).get("token").asString();

        String eventBody = "{\"title\":\"Integration Event\",\"category\":\"Taller\",\"date\":\"2026-10-20\",\"time\":\"18:00\",\"location\":\"Tatami\",\"instructor\":\"Maya\",\"capacity\":20,\"registered\":0,\"status\":\"Publicado\"}";
        MvcResult created = mockMvc.perform(post("/api/events").header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON).content(eventBody)).andExpect(status().isCreated()).andReturn();
        JsonNode event = objectMapper.readTree(created.getResponse().getContentAsString());
        String eventId = event.get("id").asString();

        mockMvc.perform(get("/api/events").header("Authorization", "Bearer " + token)).andExpect(status().isOk());
        mockMvc.perform(delete("/api/events/" + eventId).header("Authorization", "Bearer " + token)).andExpect(status().isNoContent());
    }
}