#pragma once

#include <Poco/Data/Session.h>

using Poco::Data::Session;

class DBConnector {
public:
    explicit DBConnector(Session& dbSession);

private:
    Session& m_db;
};