package com.innogrid.gedge.coredb.dao.impl;

import com.innogrid.gedge.core.model.ImageDetailInfo;
import com.innogrid.gedge.core.model.ImageInfo;
import com.innogrid.gedge.coredb.dao.ImageDao;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class ImageDaoImpl implements ImageDao {

    private SqlSessionTemplate sqlSessionTemplate;

    @Autowired
    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        this.sqlSessionTemplate = sqlSessionTemplate;
    }

    @Override
    public List<ImageInfo> getImages(Map<String, Object> params) {
        return sqlSessionTemplate.selectList("getImages", params);
    }

    @Override
    public List<ImageDetailInfo> getImageDetails(Map<String, Object> params) {
        return sqlSessionTemplate.selectList("getImageDetails", params);
    }

    @Override
    public ImageDetailInfo getImageDetail(String id) {
        return sqlSessionTemplate.selectOne("getImageDetail", id);
    }

    @Override
    public int getImageDetailIdCount(String id) {
        return sqlSessionTemplate.selectOne("getImageDetailIdCount", id);
    }

    @Override
    public int createImageDetail(ImageDetailInfo info) {
        return sqlSessionTemplate.insert("createImageDetail", info);
    }

    @Override
    public int updateImageDetail(ImageDetailInfo info) {
        return sqlSessionTemplate.update("updateImageDetail", info);
    }

    @Override
    public int deleteImageDetail(ImageDetailInfo info) {
        return sqlSessionTemplate.delete("deleteImageDetail", info);
    }
}
