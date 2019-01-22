#!/bin/bash -fe
if
	[ "${LUNA_FABRIC_API_KEY}" == "" ] || [ "${LUNA_FABRIC_BUILD_SECRET}" == "" ]
then
	exit 1
fi

sed -e "s/${LUNA_FABRIC_API_KEY}/@@LUNA_FABRIC_API_KEY@@/" -e "s/${LUNA_FABRIC_BUILD_SECRET}/@@LUNA_FABRIC_BUILD_SECRET@@/"
