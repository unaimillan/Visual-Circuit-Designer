#pragma once
#include <string>

class User {
public:
    int getId() const;
    const std::string& getUsername() const;
    const std::string& getEmail() const;
    const std::string& getName() const;
    const std::string& getCreatedAt() const;

    void setId(int id);
    void setUsername(const std::string& username);
    void setEmail(const std::string& email);
    void setName(const std::string& name);
    void setCreatedAt(const std::string& createdAt);

private:
    int m_id;
    std::string m_username;
    std::string m_email;
    std::string m_name;
    std::string m_createdAt;
};