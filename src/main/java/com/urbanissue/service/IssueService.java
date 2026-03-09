package com.urbanissue.service;

import com.urbanissue.model.Issue;
import com.urbanissue.model.User;
import com.urbanissue.repository.IssueRepository;
import com.urbanissue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    public Issue createIssue(Issue issue, Long citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        issue.setCitizen(citizen);
        issue.setStatus("OPEN");
        issue.setCreatedAt(LocalDateTime.now());

        return issueRepository.save(issue);
    }

    public List<Issue> getOpenIssues() {
        return issueRepository.findByStatus("OPEN");
    }

    public Issue resolveIssue(Long issueId, Long workerId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        if(!issue.getStatus().equals("ASSIGNED")) {
            throw new RuntimeException("Issue is not assigned yet");
        }

        if(!issue.getAssignedWorker().getId().equals(workerId)) {
            throw new RuntimeException("You are not assigned to this issue");
        }

        issue.setStatus("RESOLVED");

        return issueRepository.save(issue);
    }

    public Issue assignWorker(Long issueId, Long workerId) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        if(!worker.getRole().equalsIgnoreCase("WORKER")) {
            throw new RuntimeException("User is not a worker");
        }

        if(!worker.getApprovalStatus().equalsIgnoreCase("APPROVED")) {
            throw new RuntimeException("Worker not approved");
        }

        issue.setAssignedWorker(worker);
        issue.setStatus("ASSIGNED");

        return issueRepository.save(issue);
    }

    public List<Issue> getIssuesForWorker(Long workerId) {
        User worker = userRepository.findById(workerId).orElseThrow(() -> new RuntimeException("Worker not found"));

        if(!worker.getRole().equalsIgnoreCase("WORKER")) {
            throw new RuntimeException("User is not a worker");
        }

        return issueRepository.findByAssignedWorkerId(workerId);
    }

    public List<Issue> getIssuesByCitizenId(Long citizenId) {

        return issueRepository.findByCitizenId(citizenId);
    }

    public Map<String, Long> getIssueStatistics() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("open", issueRepository.countByStatus("OPEN"));
        stats.put("assigned", issueRepository.countByStatus("ASSIGNED"));
        stats.put("resolved", issueRepository.countByStatus("RESOLVED"));

        return stats;
    }

    public List<Issue> getIssuesByStatus(String status) {
        return issueRepository.findByStatus(status);
    }

    public List<Issue> getWorkerIssuesByStatus(Long workerId, String status) {
        if(status.equalsIgnoreCase("ALL")) {
            return issueRepository.findByAssignedWorkerId(workerId);
        }
        return issueRepository.findByAssignedWorkerIdAndStatus(workerId, status);
    }

    public Map<String, Long> getWorkerStatistics(Long workerId) {
        long assigned = issueRepository.countByAssignedWorkerIdAndStatus(workerId, "ASSIGNED");
        long resolved = issueRepository.countByAssignedWorkerIdAndStatus(workerId, "RESOLVED");
        long total = issueRepository.countByAssignedWorkerId(workerId);

        Map<String, Long> stats = new HashMap<>();

        stats.put("assigned", assigned);
        stats.put("resolved", resolved);
        stats.put("total", total);

        return stats;
    }
}
