#include "PasswordHasher.hpp"
#include <Poco/DigestEngine.h>
#include <cstddef>
#include <cstdint>
#include <Poco/PBKDF2Engine.h>
#include <Poco/HMACEngine.h>
#include <Poco/SHA1Engine.h>

using Poco::PBKDF2Engine;
using Poco::HMACEngine;
using Poco::SHA1Engine;
using Poco::DigestEngine;

std::array<uint8_t, 64> PasswordHasher::genSalt() {
    std::array<uint8_t, 64> ret;

    for (size_t i = 0; i < 64; ++i) {
        ret[i] = m_prng.nextChar();
    }

    return ret;
}

std::string PasswordHasher::encryptPassword(const std::string& password, const std::array<uint8_t, 64>& salt) {
    PBKDF2Engine<HMACEngine<SHA1Engine>> pbkdf2(std::string(salt.begin(), salt.end()));
    pbkdf2.update(password);
    return DigestEngine::digestToHex(pbkdf2.digest());
}

bool PasswordHasher::verifyPassword(const std::string& password, const std::string& hash, const std::array<uint8_t, 64>& salt) {
    return hash == encryptPassword(password, salt);
}