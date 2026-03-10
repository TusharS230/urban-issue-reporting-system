package com.urbanissue.service;

import com.urbanissue.model.Issue;
import com.urbanissue.model.IssueTimeline;
import com.urbanissue.model.User;
import com.urbanissue.repository.IssueTimelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IssueTimelineService {

    @Autowired
    private IssueTimelineRepository timelineRepository;

    public void addEvent(Issue issue, User user, String action) {
        IssueTimeline timeline = new IssueTimeline();

        timeline.setIssue(issue);
        timeline.setUser(user);
        timeline.setAction(action);
        timeline.setTime(LocalDateTime.now());

        timelineRepository.save(timeline);
    }

    public List<IssueTimeline> getTimeline(Long issueId) {
        return timelineRepository.findByIssueIdOrderByTimeAsc(issueId);
    }
}
