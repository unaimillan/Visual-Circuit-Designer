#pragma once
#include <Poco/Random.h>
#include <array>
#include <cstdint>
#include <string>

class PasswordHasher {
public:
  std::array< uint8_t, 64 > genSalt();
  std::string               encryptPassword(
                    std::string const& password, std::array< uint8_t, 64 > const& salt
                );
  bool verifyPassword(
      std::string const&               password,
      std::string const&               hash,
      std::array< uint8_t, 64 > const& salt
  );

private:
  Poco::Random m_prng;
};
