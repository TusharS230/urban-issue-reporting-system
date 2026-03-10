package com.urbanissue.service;

import com.urbanissue.model.Issue;
import com.urbanissue.model.IssueComment;
import com.urbanissue.model.User;
import com.urbanissue.repository.IssueCommentRepository;
import com.urbanissue.repository.IssueRepository;
import com.urbanissue.repository.IssueTimelineRepository;
import com.urbanissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IssueCommentService {

    @Autowired
    private IssueCommentRepository commentRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueTimelineService timelineService;

    public IssueComment addComment(Long issueId, Long userId, String commentText) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(("User not found")));

        IssueComment comment = new IssueComment();

        comment.setComment(commentText);
        comment.setIssue(issue);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());

        IssueComment savedComment = commentRepository.save(comment);
        timelineService.addEvent(issue, user, "COMMENT_ADDED");

        return savedComment;
    }

    public List<IssueComment> getComments(Long issueId) {
        return commentRepository.findByIssueId(issueId);
    }
}
