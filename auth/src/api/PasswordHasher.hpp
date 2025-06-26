#pragma once
#include <cstdint>
#include <string>
#include <array>
#include <Poco/Random.h>

class PasswordHasher {
public:
    std::array<uint8_t, 64> genSalt();
    std::string encryptPassword(const std::string& password, const std::array<uint8_t, 64>& salt);
    bool verifyPassword(const std::string& password, const std::string& hash, const std::array<uint8_t, 64>& salt);

private:
    Poco::Random m_prng;
};