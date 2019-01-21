#! /bin/sh -f
if
	[ "${LUNA_KEYSTORE_PASSWORD}" == "" ] || [ "${LUNA_KEYSTORE_KEY_PASSWORD}" == "" ]
then
	exit 1
fi
ESCAPED_KEYSTORE_PASSWORD=$(echo ${LUNA_KEYSTORE_PASSWORD} | sed 's/\([\/\\\-\|\.\*\[\}]\)/\\\1/g')
ESCAPED_KEYSTORE_KEY_PASSWORD=$(echo ${LUNA_KEYSTORE_KEY_PASSWORD} | sed 's/\([\/\\\-\|\.\*\[\}]\)/\\\1/g')
sed -e "s/$ESCAPED_KEYSTORE_PASSWORD/@@LUNA_KEYSTORE_PASSWORD@@/" -e "s/$ESCAPED_KEYSTORE_KEY_PASSWORD/@@LUNA_KEYSTORE_KEY_PASSWORD@@/"