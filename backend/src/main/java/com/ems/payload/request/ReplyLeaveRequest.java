package com.ems.payload.request;

public class ReplyLeaveRequest {
  private String status;
  private String adminReply;

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getAdminReply() {
    return adminReply;
  }

  public void setAdminReply(String adminReply) {
    this.adminReply = adminReply;
  }
}
