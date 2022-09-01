#!/bin/bash
PASSWORD="*****"

if [ -z $1 ]; then
	echo "NO INPUT IP"
	exit 1
fi

s_192_168_10_251=(/dev/sdc /dev/sdd /dev/sde)
s_192_168_10_93=(/dev/sdb /dev/sdc /dev/sdd /dev/sde /dev/sdf /dev/sdg /dev/sdh)
s_192_168_10_94=(/dev/sdb /dev/sdc /dev/sdd /dev/sde)
s_192_168_10_108=(/dev/sdb /dev/sdc /dev/sdd)
s_192_168_10_192=(/dev/sda)

function format_disk() {
	if [ -z $1 ]; then
		echo "NO SERVER LIST"
		exit 0
	else
		INPUT_IP=$1
	fi
	INPUT_DISKLIST=`eval echo '$'{$INPUT_IP[*]}`

	echo $PASSWORD | sudo -S rm -rf /var/lib/rook
	
	for disk in ${INPUT_DISKLIST[*]};
	do
	        echo $PASSWORD | sudo -S sgdisk --zap-all $disk
	        echo $PASSWORD | sudo -S dd if=/dev/zero of="$disk" bs=1M count=100 oflag=direct,dsync
	        echo $PASSWORD | sudo -S wipefs -a $disk
	        echo $PASSWORD | sudo -S partprobe $disk
	done

	echo $PASSWORD | sudo -S dmsetup remove /dev/mapper/ceph-* 
	echo $PASSWORD | sudo -S rm -rf /dev/ceph-*
	echo $PASSWORD | sudo -S rm -rf /dev/mapper/ceph-*
	
}

format_disk s_$1
