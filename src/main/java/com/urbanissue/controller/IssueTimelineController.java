package com.urbanissue.controller;

import com.urbanissue.model.IssueTimeline;
import com.urbanissue.service.IssueTimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/timeline")
public class IssueTimelineController {

    @Autowired
    private IssueTimelineService timelineService;

    @GetMapping("/issue/{issueId}")
    public List<IssueTimeline> getTimeline(@PathVariable Long issueId) {
        return timelineService.getTimeline(issueId);
    }
}
