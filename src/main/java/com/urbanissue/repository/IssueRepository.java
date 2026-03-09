package com.urbanissue.repository;

import com.urbanissue.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByStatus(String status);

    List<Issue> findByAssignedWorkerId(Long workerId);

    List<Issue> findByCitizenId(Long citizenId);

    long countByStatus(String status);

    List<Issue> findByAssignedWorkerIdAndStatus(Long workerId, String status);

    long countByAssignedWorkerId(Long workerId);

    long countByAssignedWorkerIdAndStatus(Long workerId, String status);
}
