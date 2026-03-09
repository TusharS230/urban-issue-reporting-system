package com.urbanissue.controller;

import com.urbanissue.model.IssueComment;
import com.urbanissue.service.IssueCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")

public class IssueCommentController {

    @Autowired
    private IssueCommentService commentService;

    @PostMapping("/add/{issueId}/{userId}")
    public IssueComment addComment(@PathVariable Long issueId,
                                   @PathVariable Long userId,
                                   @RequestBody String comment) {
        return commentService.addComment(issueId, userId, comment);
    }

    @GetMapping("/{issueId}")
    public List<IssueComment> getComments(@PathVariable Long issueId) {
        return commentService.getComments(issueId);
    }
}
