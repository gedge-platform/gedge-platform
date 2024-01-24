from kafka import KafkaProducer
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaAdminClient
from kafka.admin import NewTopic
from kafka.errors import KafkaError,UnknownTopicOrPartitionError
from time import sleep
import json
import time
from requests import request 
import GE_define as gDefine


class gKafka:
    def __init__(self, bootstrap_servers_info):
        self.bootstrap_servers = bootstrap_servers_info
        self.admin_client = KafkaAdminClient(bootstrap_servers=self.bootstrap_servers)
        self.set_producer()

    def set_producer(self):
        self.producer= KafkaProducer(acks=0, 
                    compression_type='gzip', 
                    bootstrap_servers=self.bootstrap_servers, 
                    value_serializer=lambda x: json.dumps(x).encode('utf-8')) 
    
    def set_consumer(self, topic_name, groupId):    
        self.consumer = KafkaConsumer(
                topic_name,
                bootstrap_servers   = self.bootstrap_servers, 
                group_id            = groupId,
                #enable_auto_commit  = True,
                enable_auto_commit  = False,
                auto_offset_reset   = 'earliest',
                value_deserializer  = lambda x: json.loads(x.decode('utf-8')), 
                consumer_timeout_ms = gDefine.CONSUMER_TIMEOUT_MS_TIME
            )
    
    def set_consumer_offset_to_end(self, topic, partition):
        # TopicPartition 객체 생성
        tp = TopicPartition(topic, partition)
        # 현재 offset을 마지막 offset으로 설정
        end_offsets = self.consumer.end_offsets([tp])
        last_offset = end_offsets[tp]
        self.consumer.seek(tp, last_offset)
    
    def kafka_msg_send(self, topic_name, msg): 
        if self.producer == None :
            print('KafkaError: producer is not set')
            return None
        try :
            result = self.producer.send(topic_name,value=msg)
            print('topic name: ', topic_name)
            print('send data : ', msg)
            self.producer.flush()
        except KafkaError as e:
            print('KafkaError:',e)
            return None   
        return result 
    
    def kafka_msg_read(self, wait_time, msg_total_count): 
        if self.consumer == None :
            print('KafkaError: consumer is not set')
            return None
        return_msgs = []
        read_count  = 0 
        retry_count = 0
        while True :
            messages = self.consumer.poll(timeout_ms=wait_time)
            for topic_partition, message_list in messages.items():
                for message in message_list:
                    read_count = read_count+1
                    return_msgs.append(message.value)
                    print('read_count',read_count)
                    self.consumer.commit()
            if read_count >= msg_total_count :
                print('all data are read_count',read_count)
                break
            retry_count = retry_count+1
            if retry_count >= gDefine.CONSUMER_MAX_RETRY_COUNT:
                return None
        return return_msgs    
    
    def get_all_topics_info(self) :
        topic_list = self.admin_client.list_topics()
        print('topic_list',topic_list, type(topic_list))
        return topic_list
    
    def delete_all_topics(self,timeout=5000):
        
        topic_list = self.admin_client.list_topics()
        for topic in topic_list:
            if not topic.startswith("__"):
                self.admin_client.delete_topics([topic])
                print('deleted topic:',topic)
    
    def isexist_topic(self,topic_name) :
        topic_list = self.admin_client.list_topics()
        for t in topic_list:
            if t == topic_name :
                return True
        return False
    
    def delete_topic(self,topic_name, timeout = 5000):
        delete_topics = [topic_name]
        try:
            # delete_topic
            self.admin_client.delete_topics(topics=delete_topics,timeout_ms=timeout)
            print(f"topic'{topic_name}' is deleted")
            self.get_all_topics_info()
        except UnknownTopicOrPartitionError:
            print(f"topic '{topic_name}' is not exist.")
        except Exception as e:
            print(f"Error deleting topic: {e}")
    
    def create_topic(self,topic_name,num_partitions,replication_factor):
        if self.isexist_topic(topic_name) :
            print(f"'{topic_name}' is existing topic")
            return 
        topic = NewTopic(
            name=topic_name,
            num_partitions=num_partitions,
            replication_factor=replication_factor
        )
        # create_topic
        try:
            self.get_all_topics_info()
            self.admin_client.create_topics(new_topics=[topic],validate_only=False)
            print(f"topic '{topic_name}' is created ")
            
        except Exception as e:
            print(f"Error creating topic: {e}")
    
    def newly_create_topic(self,topic_name,num_partitions,replication_factor):
        if self.isexist_topic(topic_name) :
            print(f"'{topic_name}' is existing topic")
            self.delete_topic(topic_name)
            return 
        topic = NewTopic(
            name=topic_name,
            num_partitions=num_partitions,
            replication_factor=replication_factor
        )
        # create_topic
        try:
            self.get_all_topics_info()
            self.admin_client.create_topics(new_topics=[topic],validate_only=False)
            print(f"topic '{topic_name}' is created ")
            
        except Exception as e:
            print(f"Error creating topic: {e}")
    
    
    def close(self):
        try:
            self.admin_client.close() 
        except Exception as e:
            print(f"Error while closing KafkaAdminClient: {e}")
       