#include "PasswordHasher.hpp"

#include <Poco/DigestEngine.h>
#include <Poco/HMACEngine.h>
#include <Poco/PBKDF2Engine.h>
#include <Poco/SHA1Engine.h>
#include <cstddef>
#include <cstdint>

using Poco::DigestEngine;
using Poco::HMACEngine;
using Poco::PBKDF2Engine;
using Poco::SHA1Engine;

std::array< uint8_t, 64 > PasswordHasher::genSalt() {
  std::array< uint8_t, 64 > ret;

  for (size_t i = 0; i < 64; ++i) { ret[i] = m_prng.nextChar(); }

  return ret;
}

std::string PasswordHasher::encryptPassword(
    std::string const& password, std::array< uint8_t, 64 > const& salt
) {
  PBKDF2Engine< HMACEngine< SHA1Engine > > pbkdf2(
      std::string(salt.begin(), salt.end())
  );
  pbkdf2.update(password);
  return DigestEngine::digestToHex(pbkdf2.digest());
}

bool PasswordHasher::verifyPassword(
    std::string const&               password,
    std::string const&               hash,
    std::array< uint8_t, 64 > const& salt
) {
  return hash == encryptPassword(password, salt);
}
