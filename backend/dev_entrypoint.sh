#!/bin/sh
npm ci
npm audit fix
npm run start:dev