#pragma once
#include <array>
#include <cstdint>
#include <string>

class User {
public:
    int getId() const;
    const std::string& getUsername() const;
    const std::string& getEmail() const;
    const std::string& getName() const;
    const std::string& getPasswordHash() const;
    const std::string& getCreatedAt() const;
    const std::array<uint8_t, 64>& getSalt() const;

    void setId(int id);
    void setUsername(const std::string& username);
    void setEmail(const std::string& email);
    void setName(const std::string& name);
    void setPasswordHash(const std::string& passwordHash);
    void setCreatedAt(const std::string& createdAt);
    void setSalt(const std::array<uint8_t, 64>& salt);

private:
    int m_id;
    std::string m_username;
    std::string m_email;
    std::string m_name;
    std::string m_passwordHash;
    std::string m_createdAt;
    std::array<uint8_t, 64> m_salt;
};