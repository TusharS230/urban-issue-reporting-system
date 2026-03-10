package com.urbanissue.repository;

import com.urbanissue.model.IssueTimeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueTimelineRepository extends JpaRepository<IssueTimeline, Long> {
    List<IssueTimeline> findByIssueIdOrderByTimeAsc(Long issueId);
}
