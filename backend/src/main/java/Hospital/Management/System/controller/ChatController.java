package Hospital.Management.System.controller;

import Hospital.Management.System.model.ChatRequest;
import Hospital.Management.System.model.ChatResponse;
import Hospital.Management.System.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = chatService.getReply(request.getMessage());

        return new ChatResponse(reply);
    }
}